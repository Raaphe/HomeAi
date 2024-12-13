export interface Price {
    USD?: number;
    CAD?: number;
    EUR?: number;
}

interface ListingBase {
    id?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    property_type?: string;
    bedrooms?: number;
    bathrooms?: number;
    building_size?: number;
    prices?: Price;
    url?: string;
}

export interface ListingDetailed extends ListingBase {
    land_size?: number;
    description?: string;
    images?: string[];
    contact?: {
        first_name?: string;
        last_name?: string;
        phone_number?: string;
        profile_pic?: string | null;
        company?: string;
        company_url?: string;
    };
    estimated_market_price?: number;
}

export interface ListingOverview extends ListingBase {
    image?: string;
}