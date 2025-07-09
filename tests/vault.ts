import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Vault } from "../target/types/vault";

describe("vault", () => {
  // Configure the client to use the local cluster.

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.vault as Program<Vault>;

  const [vaultState, vaultStateBump] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("state"), provider.wallet.publicKey.toBytes()],
      program.programId
    );

  const [vault, vaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), provider.wallet.publicKey.toBytes()],
    program.programId
  );

  it("Is initialized!", async () => {
    const tx = await program.methods
      .initialize()
      .accountsPartial({
        user: provider.wallet.publicKey,
        vault,
        vaultState,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("\nYour transaction signature", tx);
    console.log(
      "Your vault info",
      await provider.connection.getAccountInfo(vault)
    );
  });

  it("Deposits 2 sol", async () => {
    const tx = await program.methods
      .deposit(new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL))
      .accountsPartial({
        user: provider.wallet.publicKey,
        vault,
        vaultState,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("\nYour transaction signature", tx);
    console.log(
      "Your vault info",
      await provider.connection.getAccountInfo(vault)
    );
  });

  it("Withdraws 1 sol", async () => {
    const tx = await program.methods
      .withdraw(new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL))
      .accountsPartial({
        user: provider.wallet.publicKey,
        vault,
        vaultState,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("\nYour transaction signature", tx);
    console.log(
      "Your vault info",
      await provider.connection.getAccountInfo(vault)
    );
  });

  it("closes the vault", async () => {
    const tx = await program.methods
      .close()
      .accountsPartial({
        user: provider.wallet.publicKey,
        vault,
        vaultState,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("\nYour transaction signature", tx);
    console.log(
      "Your vault info",
      await provider.connection.getAccountInfo(vault)
    );
  });
});
