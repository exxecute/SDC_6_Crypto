# Module 2

## **0. Name, birthday and calculation**

**Name:** Uladzislau Mikhayevich
**Birthday:** 05.11.2002

**Calculation:**

* D = 5
* M = 11
* Y = 02

**S = D + M + Y = 5 + 11 + 2 = 18**
**R = (S mod 16) + 1 = (18 mod 16) + 1 = 2 + 1 = 3**

**Selected network: Ethereum (3)**

## **Network name and year of creation**

**Network:** Ethereum
**Mainnet launch year:** 2015

## **Consensus**

Ethereum originally used **Proof of Work (PoW)**.
After **The Merge (2022)**, it transitioned to: **Proof of Stake (PoS)**

Validators stake ETH to propose and validate blocks, replacing mining.


## **Underlying topology of the ledger**

Ethereum uses a: **Blockchain (chain of blocks)**

- Transactions are grouped into blocks
- Each block references the previous block
- Forms a continuous, chronological chain

Additionally, Ethereum uses:

- **Merkle Trees (specifically Patricia Merkle Trees)** for efficient data verification

## **Hash algorithm / Immutability**

Ethereum uses: **Keccak-256 hashing algorithm**

Immutability is achieved through:
- Cryptographic hashing of blocks
- Each block contains the hash of the previous block
- Any change in data breaks the chain consistency
- Distributed consensus ensures agreement across nodes

## **Join model**

**Public network**
- Anyone can access the network
- Anyone can read data and send transactions

## **Permission model**

**Permissionless**
- No central authority
- Anyone can become a validator (with sufficient stake)
- Open participation

## **Blockchain Trilemma (CAP theorem analogy) – Optional**

Ethereum design balances:

### **Decentralization**

- High (thousands of nodes worldwide)

### **Security**

- High (strong cryptography + PoS consensus)

### **Scalability**
- Moderate (limited transactions per second on Layer 1)

- To address scalability:
  - Uses **Layer 2 solutions** (e.g., rollups)
  - Future upgrades (sharding concepts)
