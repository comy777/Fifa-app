import { gql } from "graphql-tag";

export const LOGIN = gql`
  mutation login($input: LoginInput) {
    login(input: $input) {
      token
    }
  }
`;

export const PLAYER = gql`
  mutation searchPlayer($input: PlayerInput) {
    searchPlayer(input: $input) {
      items
      page
      players {
        club
        name
        position
        nation
      }
      totalItems
      totalPages
    }
  }
`;

export const TEAM = gql`
  mutation searchTeam($input: TeamInput) {
    searchTeam(input: $input) {
      totalItems
      totalPages
      page
      items
      players {
        club
        nation
        position
        name
      }
    }
  }
`;
