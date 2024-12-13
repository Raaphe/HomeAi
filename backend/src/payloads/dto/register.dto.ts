
import AuthenticationDTO from "./auth.dto";

export default interface RegistrationDTO extends AuthenticationDTO {
    first_name: string;
    last_name: string;
    company_name: string;
    profile_picture: string;
    phone_number: string;
}