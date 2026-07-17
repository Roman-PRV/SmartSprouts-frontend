import { type DeleteAccountWithCodeRequestDto } from "./delete-account-with-code-request-dto.type";
import { type DeleteAccountWithPasswordRequestDto } from "./delete-account-with-password-request-dto.type";

type DeleteAccountRequestDto = DeleteAccountWithCodeRequestDto | DeleteAccountWithPasswordRequestDto;

export { type DeleteAccountRequestDto };
