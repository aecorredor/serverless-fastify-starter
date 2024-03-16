import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ConfirmEmailInput = {
  code: Scalars['String'];
  email: Scalars['String'];
};

export type ConfirmEmailResponse = {
  __typename?: 'ConfirmEmailResponse';
  accessToken: Scalars['String'];
  viewer: User;
};

export type Connection = {
  edges: Array<Edge>;
  pageInfo: PageInfo;
};

export type Edge = {
  node: Node;
};

export type Mutation = {
  __typename?: 'Mutation';
  confirmEmail: ConfirmEmailResponse;
  signIn: SignInResponse;
};


export type MutationConfirmEmailArgs = {
  input: ConfirmEmailInput;
};


export type MutationSignInArgs = {
  input: SignInInput;
};

export type Node = {
  id: Scalars['ID'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  getViewer: User;
};

export type SignInInput = {
  email: Scalars['String'];
};

export type SignInResponse = {
  __typename?: 'SignInResponse';
  email: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['ID'];
  username: Scalars['String'];
};

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'SignInResponse', email: string } };

export type ConfirmEmailMutationVariables = Exact<{
  input: ConfirmEmailInput;
}>;


export type ConfirmEmailMutation = { __typename?: 'Mutation', confirmEmail: { __typename?: 'ConfirmEmailResponse', accessToken: string, viewer: { __typename?: 'User', id: string, username: string, email: string } } };


export const SignInDocument = gql`
    mutation signIn($input: SignInInput!) {
  signIn(input: $input) {
    email
  }
}
    `;
export const ConfirmEmailDocument = gql`
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    signIn(variables: SignInMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SignInMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignInMutation>(SignInDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'signIn', 'mutation');
    },
    confirmEmail(variables: ConfirmEmailMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ConfirmEmailMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConfirmEmailMutation>(ConfirmEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'confirmEmail', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;