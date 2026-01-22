import { createThirdwebClient, defineChain } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { type ChainConfig, getChainConfig, USDC_DECIMALS } from "./chains";


interface FacilitatorConfig {
    client: ReturnType<typeof createThirdwebClient>;
    serverWalletAddress: string;
    waitUntil?: "simulated" | "submitted" | "confirmed";
}

export class ThirdWebFacilitator {
    private config: FacilitatorConfig;
    private readonly chainConfig: ChainConfig;

    constructor(config: FacilitatorConfig) {
        this.config = config;
        this.chainConfig = getChainConfig();
    }

    // get supported payment methods

    /**
     * Retrieves the supported payment schemes, networks, and token details.
     *
     * @param {Object} [options] Optional parameters to specify chain and token details.
     * @param {number} [options.chainId] The chain ID for which to retrieve supported data. Defaults to the current configuration's chain ID.
     * @param {string} [options.tokenAddress] The address of a specific token to check support for. Optional.
     * @return {Promise<{schemes: string[], networks: string[], tokens: Array<{address: string, symbol: string, decimals: number, chainId: number}>>}>}
     * A promise that resolves to an object containing the supported payment schemes, networks, and token details.
     */
    async supported(options?: {
        chainId?: number;
        tokenAddress?: string;
    }): Promise<{
        schemes: string[];
        networks: string[];
        tokens: Array<{
            address: string;
            symbol: string;
            decimals: number;
            chainId: number;
        }>;
    }> {
        const chainId = options?.chainId || this.chainConfig.chainId;

        return {
            schemes: ["exact"],
            networks: [this.chainConfig.networkString],
            tokens: [
                {
                    address: this.chainConfig.usdc,
                    symbol: "USDC",
                    decimals: USDC_DECIMALS,
                    chainId,
                },
            ]
        };
    }

    /**
     * Verifies the integrity and validity of a given payment payload against the provided payment requirements.
     *
     * @param {string} paymentPayload - A base64 encoded string containing the payment payload.
     * @param {object} _paymentRequirements - An object containing the specific requirements for the payment.
     * @return {Promise<{isValid: boolean, invalidReason?: string}>} A promise that resolves to an object indicating
     * whether the payload is valid and, if not, the reason for the invalidity.
     */
    async verify(paymentPayload: string, _paymentRequirements: object): Promise<{
        isValid: boolean;
        invalidReason?: string;
    }> {
        try {
            const payload = JSON.parse(
                Buffer.from(paymentPayload, "base64").toString("utf-8")
            );

            if (!payload.x402Version || !payload.scheme || !payload.network) {
                return {
                    isValid: false,
                    invalidReason: "Invalid payment payload structure"
                };
            }

            if (payload.scheme !== "exact") {
                return {
                    isValid: false,
                    invalidReason: "Unsupported payment scheme"
                }
            }

            if (payload.network !== this.chainConfig.networkString) {
                return {
                    isValid: false,
                    invalidReason: "Network mismatch"
                }
            }

            return {
                isValid: true
            }
        } catch (error) {
            return {
                isValid: false,
                invalidReason: error instanceof Error ? error.message : "Verification failed"
            }
        }
    }

    /**
     * Processes the settlement of a payment transaction.
     *
     * @param {string} paymentPayload - The encoded payload of the payment transaction in base64 format.
     * @param {object} _paymentRequirements - The payment requirements and additional constraints for processing the transaction.
     * @return {Promise<{success: boolean, txHash?: string, networkId?: string, error?: string}>}
     *         A promise that resolves to an object with the settlement outcome. The object contains:
     *         - `success` (boolean): Indicates if the transaction was successfully settled.
     *         - `txHash` (string, optional): The transaction hash if the settlement is successful.
     *         - `networkId` (string, optional): The network ID where the transaction took place.
     *         - `error` (string, optional): An error message if the settlement fails.
     */
    async settle(
        paymentPayload: string,
        _paymentRequirements: object,
    ): Promise<{
        success: boolean;
        txHash?: string;
        networkId?: string;
        error?: string;
    }> {
        try {
            JSON.parse(Buffer.from(paymentPayload, "base64").toString("utf-8"));

            // let us simulate a successful settlement for hackathon demo
            const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16)
                .toString(16)).join("")}`

            return {
                success: true,
                txHash: mockTxHash,
                networkId: this.chainConfig.networkString
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Settlement failed"
            };
        }
    }

    /**
     * Retrieves the chain configuration.
     *
     * @return {Object} The current chain configuration.
     */
    getChainConfig() {
        return this.chainConfig;
    }

    /**
     * Retrieves the server wallet address configured in the application.
     *
     * @return {string} The server wallet address.
     */
    getServerWalletAddress() {
        return this.config.serverWalletAddress;
    }
}

/**
 * Retrieves the singleton instance of the ThirdWebFaciliator.
 * If the instance does not already exist, it initializes a new instance
 * using the server wallet address from the environment variables.
 *
 * @throws {Error} If the SERVER_WALLET_ADDRESS environment variable is not defined.
 * @return {ThirdWebFacilitator} The singleton instance of the ThirdWebFacilitator.
 */
export function getFacilitator(): ThirdWebFacilitator {
    if (!_facilitatorInstance) {
        const serverWalletAddress = process.env.SERVER_WALLET_ADDRESS;

        if (!serverWalletAddress) {
            throw new Error("SERVER_WALLET_ADDRESS is required");
        }

        _facilitatorInstance = new ThirdWebFacilitator({
            client: getThirdWebClient(),
            serverWalletAddress,
            waitUntil: "confirmed",
        });
    }

    return _facilitatorInstance;
}


/**
 * Creates payment requirements for a specified session, amount, and merchant address.
 *
 * @param {string} sessionId - The unique identifier for the payment session.
 * @param {number} amount - The payment amount in base currency units.
 * @param {string} merchantAddress - The address of the merchant receiving the payment.
 * @param {string} [description="Tink Protocol Tip Payment"] - An optional description for the payment.
 *
 * @return {object} The payment requirements containing network, amount, timeout, and other metadata for processing the payment.
 */
export function createPaymentRequirements(
    sessionId: string,
    amount: number,
    merchantAddress: string,
    description: string = "Tink Protocol Tip Payment"
): object {
    const chainConfig = getChainConfig();

    return {
        x402Version: 1,
        scheme: "exact",
        network: chainConfig.networkString,
        maxAmountRequired: (amount * 1e6).toString(),
        resource: `/api/payments/settle/${sessionId}`,
        description,
        mimeType: "application/json",
        payTo: merchantAddress,
        maxTimeoutSeconds: 300,
        asset: chainConfig.usdc,
        extra: {
            name: "USD Coin",
            version: "2",
            chainId: chainConfig.chainId,
        },
    };
}


// initializing the client and the instance
let _client: ReturnType<typeof createThirdwebClient> | null = null;
let _facilitatorInstance: ThirdWebFacilitator | null = null;

/**
 * Retrieves an instance of the ThirdWeb client. If the client does not already exist,
 * it is initialized using the secret key from the environment variables.
 *
 * @throws {Error} If the ThirdWeb secret key is not provided in environment variables.
 * @return {ReturnType<typeof createThirdwebClient>} An instance of the ThirdWeb client.
 */
export function getThirdWebClient(): ReturnType<typeof createThirdwebClient> {
    if (!_client) {
        const secretKey = process.env.THIRDWEB_SECRET_KEY;

        if (!secretKey) {
            throw new Error("ThirdWeb secret key is required!!");
        }

        _client = createThirdwebClient({ secretKey });

    }

    return _client;
}

/**
 * Retrieves the server account for signing transactions.
 * Requires PRIVATE_KEY to be set in environment variables.
 *
 * @return {ReturnType<typeof privateKeyToAccount>} The server account.
 */
export function getServerAccount() {
    const privateKey = process.env.SERVER_WALLET_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("SERVER_WALLET_PRIVATE_KEY is required for contract interaction");
    }
    return privateKeyToAccount({
        privateKey,
        client: getThirdWebClient(),
    });
}

/**
 * Retrieves the Thirdweb chain object for the current configuration.
 *
 * @return {ReturnType<typeof defineChain>} The chain object.
 */
export function getChain() {
    const config = getChainConfig();
    return defineChain(config.chainId);
}

