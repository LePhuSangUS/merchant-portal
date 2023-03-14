type UpdateCollectionServiceConfig = {
    isActive: boolean,
    secretKey?: string,
    url?: string,
}

type SwitchCollectionServiceState = {
    isActiveApi: boolean,
}

declare namespace CollectionService {
    type CreatePayoutRequest = {
        merchantId: string;
        payoutType: string; // BANK || WALLET
        value: number; // Số tiền
        bankAccountName: string;
        bankAccountNumber: string;
        accountType: string; // CARD || ACCOUNT
        bankName: string;
        bankBranch: string;
        bankCode: string;
        note: string;
    }

    type PayoutConfig = {
        autoBankId?: string;
        isAuto: boolean;
        payoutType?: string
    }

    type SFTPConfig = Record<string, any>
}