import { AnchorProvider, web3 } from '@project-serum/anchor'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { web3Config } from './web3Configs'
import { MintLayout, RawMint, AccountLayout as TokenAccountLayout, getAssociatedTokenAddressSync } from '@solana/spl-token'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'

const log = console.log;

const MPL_ID = new web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")

class BaseMpl {
  static getMetadataAccount(tokenId: web3.PublicKey) {
    return web3.PublicKey.findProgramAddressSync(
      [utf8.encode("metadata"), MPL_ID.toBuffer(), tokenId.toBuffer()],
      MPL_ID
    )[0];
  }

}

export class Connectivity {
  user: web3.PublicKey
  connection: web3.Connection
  ixs: web3.TransactionInstruction
  provider: AnchorProvider
  cacheTokenListInfo: Map<string, { name: string, decimal: number }> | null

  constructor(wallet: AnchorWallet) {
    this.connection = new web3.Connection(web3Config.rpcEndpoint)
    this.provider = new AnchorProvider(this.connection, wallet, { commitment: 'confirmed' });
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
} 
