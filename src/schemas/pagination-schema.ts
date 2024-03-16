import { gql } from 'graphql-tag';

export const PaginationSchema = gql`
  interface Node {
    id: ID!
  }

  interface Edge {
    node: Node!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }

  interface Connection {
    edges: [Edge!]!
    pageInfo: PageInfo!
  }
`;
