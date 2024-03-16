import { gql } from 'graphql-tag';

export const UserOperations = gql`
  mutation signIn($input: SignInInput!) {
    signIn(input: $input) {
      email
    }
  }

  mutation confirmEmail($input: ConfirmEmailInput!) {
    confirmEmail(input: $input) {
      viewer {
        id
        username
        email
      }
      accessToken
    }
  }
`;
