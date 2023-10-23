import { Program, web3, BN, AnchorProvider } from '@project-serum/anchor'
import { Wallet as AWallet } from '@project-serum/anchor/dist/browser/src/provider'
import { IDL, Escrow } from "./escrow";
import { BaseSpl } from './baseSpl';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { ASSOCIATED_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import { TOKEN_PROGRAM_ID, MintLayout, RawMint, AccountLayout as TokenAccountLayout, getAssociatedTokenAddressSync, getMint, createTransferInstruction } from '@solana/spl-token'
import { web3Config } from './web3Configs'

// solana pay
// import { Cluster, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { encodeURL } from '@solana/pay';
import BigNumber from 'bignumber.js';

const log = console.log;
export const MAX_FEE_RATE = 1000_000;
const Seeds = {
  mainState: utf8.encode("main"),
  vault: utf8.encode('vault'),
}
const tokenProgram = TOKEN_PROGRAM_ID
const systemProgram = web3.SystemProgram.programId
const associatedTokenProgram = ASSOCIATED_PROGRAM_ID
const MPL_ID = new web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")

class BaseMpl {
  static getMetadataAccount(tokenId: web3.PublicKey) {
    return web3.PublicKey.findProgramAddressSync(
      [utf8.encode("metadata"), MPL_ID.toBuffer(), tokenId.toBuffer()],
      MPL_ID
    )[0];
  }
}

export function getNonDecimalAmount(amount: number, decimal): number {
  return Math.trunc((10 ** decimal) * amount);
}
export function getDecimalAmount(amount: number, decimal): number {
  return amount / (10 ** decimal)
}

export type Result<T, E> = {
  Ok?: T;
  Err?: E;
};
export type TxPassType<Info> = { signature: string, info?: Info };

export class Connectivity {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  txis: web3.TransactionInstruction[] = [];
  program: Program<Escrow>;
  mainState: web3.PublicKey;
  connection: web3.Connection;
  baseSpl: BaseSpl
  cacheTokenListInfo: Map<string, { name: string, decimal: number }> | null

  constructor(wallet: AWallet) {
    if (!wallet) return;
    const connection = new web3.Connection(web3Config.rpcEndpoint, { commitment: 'confirmed' });
    const provider = new AnchorProvider(
      connection, wallet,
      { commitment: 'confirmed' }
    )

    this.provider = provider;
    this.connection = provider.connection
    this.programId = new web3.PublicKey(web3Config.programId)
    this.program = new Program(IDL, this.programId, this.provider);
    this.mainState = web3.PublicKey.findProgramAddressSync(
      [Seeds.mainState],
      this.programId
    )[0];
    this.baseSpl = new BaseSpl(this.connection)
  }

  ixCallBack = (ixs?: web3.TransactionInstruction[]) => {
    if (ixs) {
      this.txis.push(...ixs)
    }
  }
  reInit() {
    this.txis = []
  }

  //EX 
  async transferToken(args: { token: web3.PublicKey | string, receiver: web3.PublicKey | string, amount: number }): Promise<Result<TxPassType<any>, any>> {
    try {
      this.reInit();
      const user = this.provider.publicKey;
      if (!user) throw 'Wallet not found!'
      let {
        token,
        receiver,
        amount,
      } = args;

      if (typeof token == 'string') token = new web3.PublicKey(token)
      if (typeof receiver == 'string') receiver = new web3.PublicKey(receiver)
      const tokenInfo = await getMint(this.connection, token);
      const _amount = getNonDecimalAmount(amount, tokenInfo.decimals)
      const { ata: senderAta } = await this.baseSpl.__getOrCreateTokenAccountInstruction({ mint: token, owner: user, payer: user }, this.ixCallBack);
      const { ata: receiverAta } = await this.baseSpl.__getOrCreateTokenAccountInstruction({ mint: token, owner: receiver, payer: user }, this.ixCallBack);
      const transferIx = createTransferInstruction(senderAta, receiverAta, user, _amount);
      this.txis.push(transferIx)

      const tx = new web3.Transaction().add(...this.txis)
      const signature = await this.provider.sendAndConfirm(tx);
      return { Ok: { signature } }
    } catch (error) {
      return { Err: error }
    }
  }

  async transferSol(args: { receiver: web3.PublicKey | string, amount: number }): Promise<Result<TxPassType<any>, any>> {
    try {
      this.reInit();
      const user = this.provider.publicKey;
      if (!user) throw 'Wallet not found!'
      let {
        receiver,
        amount,
      } = args;

      if (typeof receiver == 'string') receiver = new web3.PublicKey(receiver)
      const _amount = getNonDecimalAmount(amount, 9)
      const transferIx = web3.SystemProgram.transfer({
        fromPubkey: user,
        toPubkey: receiver,
        lamports: _amount
      });

      const tx = new web3.Transaction().add(transferIx)
      const signature = await this.provider.sendAndConfirm(tx);
      return { Ok: { signature } }
    } catch (error) {
      return { Err: error }
    }
  }


  getVaultAccount(sender: web3.PublicKey, id: number) {
    log({ be: new BN(id).toBuffer('le', 8) })
    return web3.PublicKey.findProgramAddressSync([
      Seeds.vault,
      sender.toBytes(),
      new BN(id).toBuffer('le', 8),
    ], this.programId)[0]
  }

  async getVaultInfo(vaultAccount: web3.PublicKey | string) {
    if (typeof vaultAccount == 'string') vaultAccount = new web3.PublicKey(vaultAccount)
    try {
      const info = await this.program.account.vaultState.fetch(vaultAccount)
      const parseInfo = JSON.parse(JSON.stringify(info))
      log({ parseInfo })

    } catch (vaultInfoFetchError) {
      log({ vaultInfoFetchError })
      return null;
    }
  }

  // async getVaultInfo(args: { id?: number, sender?: web3.PublicKey | string, vaultAccount?: web3.PublicKey }) {
  //   let {
  //     sender,
  //     id,
  //     vaultAccount,
  //   } = args;
  //
  //   let _vaultAccount = null;
  //   if (vaultAccount) {
  //     _vaultAccount = vaultAccount
  //   } else {
  //     if (!sender || !id) throw "Unable to prase args to get vaultAccount"
  //     if (typeof sender == 'string') sender = new web3.PublicKey(sender)
  //     _vaultAccount = this.getVaultAccount(sender, id);
  //   }
  //
  //   return await this._getVaultInfo(vaultAccount);
  // }

  async createVault(args: {
    amount: number,
    token: web3.PublicKey | string
    receiver: web3.PublicKey | string
  }): Promise<Result<TxPassType<{
    id: number,
    sender: string,
    receiver: string,
    token: string,
    amount: number
    vaultAccount: string
  }>, any>> {
    try {
      this.reInit()
      const sender = this.provider.publicKey;
      if (!sender) "throw wallet not found"
      let { token, amount, receiver } = args;
      if (typeof token == 'string') token = new web3.PublicKey(token)
      if (typeof receiver == 'string') receiver = new web3.PublicKey(receiver)
      // const isSol = false;
      const id = Date.now();
      const feeReceiver = (await this.program.account.mainState.fetch(this.mainState)).feeReceiver
      const { ata: feeReceiverAta } = await this.baseSpl.__getOrCreateTokenAccountInstruction({ mint: token, owner: feeReceiver, payer: sender }, this.ixCallBack)

      const vault = this.getVaultAccount(sender, id);
      log({ vault })
      const vaultAta = getAssociatedTokenAddressSync(token, vault, true);
      log(2)
      const { ata: senderAta } = await this.baseSpl.__getOrCreateTokenAccountInstruction({ owner: sender, mint: token, payer: sender }, this.ixCallBack);
      log(3)
      const tokenDecimal = (MintLayout.decode((await this.connection.getAccountInfo(token)).data)).decimals
      const _amount = getNonDecimalAmount(amount, tokenDecimal);

      const ix = await this.program.methods.createVault({ amount: new BN(_amount), receiver, id: new BN(id) }).accounts({
        token,
        sender,
        senderAta,
        vault,
        vaultAta,
        mainState: this.mainState,
        feeReceiverAta,
        tokenProgram,
        systemProgram,
        associatedTokenProgram,
      }).instruction();
      this.txis.push(ix)
      const tx = new web3.Transaction().add(...this.txis);
      this.txis = []
      const signature = await this.provider.sendAndConfirm(tx);
      log(3)

      return {
        Ok: {
          signature,
          info: {
            amount,
            token: token.toBase58(),
            receiver: receiver.toBase58(),
            sender: sender.toBase58(),
            vaultAccount: vault.toBase58(),
            id
          }
        }
      }
    } catch (error) {
      return { Err: error }
    }
  }

  async revertPayment(
    vaultAccount: web3.PublicKey | string
  ): Promise<Result<TxPassType<any>, any>> {
    try {
      this.reInit();
      const sender = this.provider.publicKey;
      if (!sender) throw "Wallet not found"

      if (typeof vaultAccount == 'string') vaultAccount = new web3.PublicKey(vaultAccount)
      const vaultInfo = await this.program.account.vaultState.fetch(vaultAccount);
      if (sender.toBase58() != vaultInfo.sender.toBase58()) throw "Unknown sender"
      const token = vaultInfo.token
      const { ata: senderAta } = await this.baseSpl.__getOrCreateTokenAccountInstruction({ mint: token, owner: sender },)
      const vaultAta = getAssociatedTokenAddressSync(token, vaultAccount, true);

      const ix = await this.program.methods.revertPayment().accounts({
        systemProgram,
        tokenProgram,
        vaultAta,
        senderAta,
        sender,
        vaultState: vaultAccount,
      }).instruction()
      this.txis.push(ix)

      const tx = new web3.Transaction().add(...this.txis);
      const signature = await this.provider.sendAndConfirm(tx);

      return { Ok: { signature } }
    } catch (error) {
      return { Err: error }
    }
  }

  async redeemPayment(vaultAccount: web3.PublicKey | string): Promise<Result<TxPassType<any>, any>> {
    this.reInit()
    try {
      const receiver = this.provider.publicKey;
      if (!receiver) throw "Wallet not found"
      if (typeof vaultAccount == 'string') vaultAccount = new web3.PublicKey(vaultAccount)
      const vaultInfo = await this.program.account.vaultState.fetch(vaultAccount);
      const token = vaultInfo.token
      const sender = vaultInfo.sender
      if (receiver.toBase58() != vaultInfo.receiver.toBase58()) throw "Unknown Receiver"
      const vaultAta = getAssociatedTokenAddressSync(token, vaultAccount, true);
      const { ata: receiverAta } = await this.baseSpl.__getOrCreateTokenAccountInstruction({
        mint: token, owner: receiver
      }, this.ixCallBack)

      const ix = await this.program.methods.redeemPayment().accounts({
        vaultState: vaultAccount,
        sender,
        vaultAta,
        tokenProgram,
        systemProgram,
        receiver,
        receiverAta,
      }).instruction()
      this.txis.push(ix)

      const tx = new web3.Transaction().add(...this.txis);
      const signature = await this.provider.sendAndConfirm(tx);
      return { Ok: { signature } }
    } catch (error) {
      return { Err: error }
    }
  }


  async getAllUserTokens() {
    const user = this.provider.publicKey;
    if (!user) throw "Wallet not found"
    const tokens = web3Config.tokensList.map((e) => new web3.PublicKey(e));

    const ataAccounts = tokens.map((mint) => getAssociatedTokenAddressSync(mint, user))
    const atasAccountsInfo = await this.connection.getMultipleAccountsInfo(ataAccounts)

    const userTokensAmount = new Map<string, number>();
    for (let accountInfo of atasAccountsInfo) {
      if (accountInfo) {
        try {
          const tokenAccount = TokenAccountLayout.decode(accountInfo.data)
          userTokensAmount.set(tokenAccount.mint.toBase58(), parseInt(tokenAccount.amount.toString()))
        } catch { }
      }
    }

    log({ userTokensAmount })
    return userTokensAmount;
  }

  async getTokenListInfo(forceFetch = false) {
    if (this.cacheTokenListInfo && !forceFetch) {
      log("using cache")
      return this.cacheTokenListInfo
    }

    const tokens = web3Config.tokensList.map((e) => new web3.PublicKey(e));
    const tokensAccountInfo = await this.connection.getMultipleAccountsInfo(tokens);
    const tokenInfos: RawMint[] = [];
    for (let i of tokensAccountInfo) {
      tokenInfos.push(MintLayout.decode(i.data))
    }
    const metadataAccounts = tokens.map((token) => BaseMpl.getMetadataAccount(token))
    const metadataAccountsInfo = await this.connection.getMultipleAccountsInfo(metadataAccounts);
    const map = new Map<string, { name: string, decimal: number }>();

    for (let i = 0; i < metadataAccountsInfo.length; ++i) {
      const buffer = metadataAccountsInfo[i]
      const decimal = tokenInfos[i].decimals
      let metadata: Metadata | null = null
      try {
        metadata = Metadata.fromAccountInfo(buffer)[0]
      } catch { }

      if (metadata) {
        map.set(metadata.mint.toBase58(), { name: metadata.data.name.split('\0')[0], decimal })
      }
    }

    this.cacheTokenListInfo = map;
    log({ map })
    return map;
  }

  // testing
  /**
   * if token not provied then its create url for sol transfer
  */
  async createSolPayUrl(_amount: number, token?: web3.PublicKey | string, tokenDecimal?: number) {
    if (typeof token == 'string') token = new web3.PublicKey(token);
    // const recipient = new web3.PublicKey("3nAQ3RZgsDewYf6HRdwD3beKc5tiV6TC1ufKg54QCV8i")
    const recipient = this.provider?.publicKey

    if (token && !tokenDecimal) {
      const tokenAccountInfo = await this.connection.getAccountInfo(token);
      if (!tokenAccountInfo) throw 'Unable to find token amount'

      const recipientAtaInfo = await this.connection.getAccountInfo(getAssociatedTokenAddressSync(token, recipient));
      if (!recipientAtaInfo) throw 'Recipient TokenAccount need to be initialised first'
    }
    tokenDecimal = tokenDecimal ?? 9; // default is 9 becuase sol amount decimal is 9

    const amount = new BigNumber(_amount, tokenDecimal);
    /** * The `reference` should be unique to a single customer session, 
     * and will be used to find and validate the payment in the future. */
    const reference = new web3.Keypair().publicKey;
    const label = 'Jungle Cats store';
    const message = 'Jungle Cats store - your order - #001234';
    const memo = 'JC#4098';

    console.log('3. Create a payment request link \n');
    const url = encodeURL({ recipient, amount, reference, label, message, memo });
    return url
  }
}
