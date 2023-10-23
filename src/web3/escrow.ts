export type Escrow = {
  "version": "0.1.0",
  "name": "escrow",
  "instructions": [
    {
      "name": "initMainState",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mainState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "feeReceiver",
          "type": "publicKey"
        },
        {
          "name": "feeRate",
          "type": "u64"
        },
        {
          "name": "holdingTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updateMainState",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mainState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "feeReceiver",
          "type": "publicKey"
        },
        {
          "name": "feeRate",
          "type": "u64"
        },
        {
          "name": "holdingTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updateMainStateOwner",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mainState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newOwner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createVault",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "token",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "senderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mainState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeReceiverAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "CreateVaultInput"
          }
        }
      ]
    },
    {
      "name": "revertPayment",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "senderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "redeemPayment",
      "accounts": [
        {
          "name": "receiver",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "receiverAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "mainState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "feeReceiver",
            "type": "publicKey"
          },
          {
            "name": "feeRate",
            "type": "u64"
          },
          {
            "name": "holdingTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "vaultState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sender",
            "type": "publicKey"
          },
          {
            "name": "receiver",
            "type": "publicKey"
          },
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "releaseTime",
            "type": "i64"
          },
          {
            "name": "token",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CreateVaultInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "receiver",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UnAuthorisedCaller",
      "msg": "This methods only call by specfic owner only"
    },
    {
      "code": 6001,
      "name": "TokensAreReleased",
      "msg": "Tokens are released for reciver"
    },
    {
      "code": 6002,
      "name": "TokensAreNotReleased",
      "msg": "Tokens are released not"
    }
  ]
};

export const IDL: Escrow = {
  "version": "0.1.0",
  "name": "escrow",
  "instructions": [
    {
      "name": "initMainState",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mainState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "feeReceiver",
          "type": "publicKey"
        },
        {
          "name": "feeRate",
          "type": "u64"
        },
        {
          "name": "holdingTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updateMainState",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mainState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "feeReceiver",
          "type": "publicKey"
        },
        {
          "name": "feeRate",
          "type": "u64"
        },
        {
          "name": "holdingTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updateMainStateOwner",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mainState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newOwner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createVault",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "token",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "senderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mainState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeReceiverAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "CreateVaultInput"
          }
        }
      ]
    },
    {
      "name": "revertPayment",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "senderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "redeemPayment",
      "accounts": [
        {
          "name": "receiver",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "receiverAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "mainState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "feeReceiver",
            "type": "publicKey"
          },
          {
            "name": "feeRate",
            "type": "u64"
          },
          {
            "name": "holdingTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "vaultState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sender",
            "type": "publicKey"
          },
          {
            "name": "receiver",
            "type": "publicKey"
          },
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "releaseTime",
            "type": "i64"
          },
          {
            "name": "token",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CreateVaultInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "receiver",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UnAuthorisedCaller",
      "msg": "This methods only call by specfic owner only"
    },
    {
      "code": 6001,
      "name": "TokensAreReleased",
      "msg": "Tokens are released for reciver"
    },
    {
      "code": 6002,
      "name": "TokensAreNotReleased",
      "msg": "Tokens are released not"
    }
  ]
};
