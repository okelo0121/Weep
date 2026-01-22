import path from "path";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Weep Protocol API',
            version: '1.0.0',
            description: 'AI-native micro-tipping backend with x402 + Thirdweb on Cronos',
        },
        components: {
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean'
                        },
                        data: {
                            type: 'object',
                            nullable: true
                        },
                        error: {
                            type: 'string',
                            nullable: true
                        },
                        message: {
                            type: 'string',
                            nullable: true
                        }
                    }
                },
                Merchant: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        slug: { type: 'string' },
                        walletAddress: { type: 'string' },
                        avatar: { type: 'string', nullable: true },
                        onChainPolicyId: { type: 'integer', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                MerchantStats: {
                    type: 'object',
                    properties: {
                        totalTipsToday: { type: 'number' },
                        totalTipsThisWeek: { type: 'number' },
                        totalTipsAllTime: { type: 'number' },
                        tipCountTotal: { type: 'integer' },
                        percentChangeToday: { type: 'number' },
                        percentChangeWeek: { type: 'number' }
                    }
                },
                TipSplit: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        merchantId: { type: 'string' },
                        name: { type: 'string' },
                        percentage: { type: 'number' },
                        walletAddress: { type: 'string', nullable: true },
                        employeeId: { type: 'string', nullable: true }
                    }
                },
                TipSplitConfig: {
                    type: 'object',
                    properties: {
                        merchantId: { type: 'string' },
                        splits: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TipSplit' }
                        }
                    }
                },
                Employee: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        merchantId: { type: 'string' },
                        name: { type: 'string' },
                        walletAddress: { type: 'string' },
                        role: { type: 'string' },
                        status: { type: 'string', enum: ['active', 'inactive'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                TipAllocation: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        transactionId: { type: 'string' },
                        merchantId: { type: 'string' },
                        employeeId: { type: 'string', nullable: true },
                        recipientName: { type: 'string' },
                        recipientWallet: { type: 'string' },
                        amount: { type: 'number' },
                        percentage: { type: 'number' },
                        status: { type: 'string', enum: ['pending', 'distributed'] },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                TipSession: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        merchantId: { type: 'string' },
                        billAmount: { type: 'number' },
                        tipAmount: { type: 'number', nullable: true },
                        tipPercentage: { type: 'number', nullable: true },
                        totalAmount: { type: 'number', nullable: true },
                        currency: { type: 'string' },
                        status: { type: 'string' },
                        memo: { type: 'string' },
                        payerAddress: { type: 'string', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        expiresAt: { type: 'string', format: 'date-time' }
                    }
                },
                Transaction: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        sessionId: { type: 'string' },
                        merchantId: { type: 'string' },
                        payerAddress: { type: 'string' },
                        recipientAddress: { type: 'string' },
                        billAmount: { type: 'number' },
                        tipAmount: { type: 'number' },
                        totalAmount: { type: 'number' },
                        currency: { type: 'string' },
                        txHash: { type: 'string' },
                        networkId: { type: 'string' },
                        onChainPolicyId: { type: 'integer', nullable: true },
                        status: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        confirmedAt: { type: 'string', format: 'date-time', nullable: true }
                    }
                },
                RecentTip: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        date: { type: 'string', format: 'date-time' },
                        amount: { type: 'number' },
                        txHash: { type: 'string' },
                        status: { type: 'string' },
                        payerAddress: { type: 'string', nullable: true }
                    }
                },
                Dispute: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        sessionId: { type: 'string' },
                        merchantId: { type: 'string' },
                        reason: { type: 'string' },
                        details: { type: 'string' },
                        status: { type: 'string' },
                        submittedBy: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        resolvedAt: { type: 'string', format: 'date-time', nullable: true },
                        resolution: { type: 'string', nullable: true }
                    }
                },
                TipOption: {
                    type: 'object',
                    properties: {
                        percentage: { type: 'number' },
                        amount: { type: 'number' },
                        total: { type: 'number' }
                    }
                },
                RoundUpOption: {
                    type: 'object',
                    properties: {
                        amount: { type: 'number' },
                        tipAmount: { type: 'number' },
                        total: { type: 'number' }
                    }
                },
                TipCalculation: {
                    type: 'object',
                    properties: {
                        billAmount: { type: 'number' },
                        options: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TipOption' }
                        },
                        roundUp: { $ref: '#/components/schemas/RoundUpOption' }
                    }
                },
                AISuggestion: {
                    type: 'object',
                    properties: {
                        suggestedPercentage: { type: 'number' },
                        suggestedAmount: { type: 'number' },
                        reasoning: { type: 'string', nullable: true },
                        confidence: { type: 'number' }
                    }
                }
            }
        }
    },
    apis: [
        path.resolve(__dirname, 'routes/*.ts'),
        path.resolve(__dirname, 'routes/*.js'),
    ]
};

const specs = swaggerJsDoc(options);

export {specs, swaggerUi};