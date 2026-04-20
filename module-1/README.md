# Module 1

## Correct Symmetric Key

**HEX:**

```
54684020247570407220244063724074
```

## Decrypted Message

```
Hello Blockchain!
```

## -Asymmetric Public Key (Elliptic Curve, PEM format)

```
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE+B2SdBh/3AabvO4lk5di3S5bG7W4
LtFSaF1oMYdkUky6/aEgDzFEymYv662J+/GpkM+8qMgY78xzMOHzDrl2Kg==
-----END PUBLIC KEY-----
```

## -Digital Signature (HEX)

```
3045022100f28d64f60850d1077df0378caabd5fcd4b5e1d53747ffdd546039728c5e480ee0220250121f6c17ffdb1c29e880571f8ab983f87cf9798be0279d15845d82fdbef89
```

## Step-by-step explanation 

### Step 1: Identify the correct symmetric key

- You were given **3 candidate 128-bit keys (HEX)**.
- For each key:
  1. Convert HEX → bytes
  2. Compute its **SHA-256 hash**
  3. Compare with the provided hash:
     ```
     f28fe539655fd6f7275a09b7c3508a3f81573fc42827ce34ddf1ec8d5c2421c3
     ```
- Only this key matched:
  ```
  54684020247570407220244063724074
  ```

### Step 2: Decrypt the AES-128 encrypted message

- Configuration used:
  - **Algorithm:** AES-128
  - **Mode:** CBC
  - **Key:** (correct key above)
  - **IV:** `656e6372797074696f6e496e74566563`
- Process:
  1. Convert ciphertext, key, and IV from HEX → bytes
  2. Decrypt using AES-CBC
  3. Result contained padding:
     ```
     Hello Blockchain!\x0f\x0f...
     ```
  4. Remove **PKCS#7 padding**
  5. Final plaintext:
     ```
     Hello Blockchain!
     ```
