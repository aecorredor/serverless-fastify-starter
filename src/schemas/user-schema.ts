import { gql } from 'graphql-tag';

export const UserSchema = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  input SignInInput {
    email: String!
  }

  input ConfirmEmailInput {
    email: String!
    code: String!
  }

  type SignInResponse {
    email: String!
  }

  type ConfirmEmailResponse {
    viewer: User!
    accessToken: String!
  }

  type Mutation {
    signIn(input: SignInInput!): SignInResponse!
    confirmEmail(input: ConfirmEmailInput!): ConfirmEmailResponse!
  }

  type Query {
    getViewer: User!
  }
`;
