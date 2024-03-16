import { gql } from "@apollo/client";

export const GET_REPORTS = gql`
  query Reports {
    reports {
      id
      title
      description
      mainImage
      User {
        name
      }
      Type {
        name
      }
      latitude
      longitude
      location
    }
  }
`;

export const GET_REPORT_DETAILS = gql`
  query Report($reportId: ID!) {
    report(id: $reportId) {
      id
      mainImage
      isActive
      description
      title
      User {
        name
      }
      latitude
      longitude
      location
      createdAt
    }
  }
`;

export const ADD_REPORT = gql`
  mutation Mutation($newReport: ReportInput!) {
    createReport(newReport: $newReport) {
      id
      title
      description
      mainImage
      type
      latitude
      longitude
    }
  }
`;

export const GET_TYPES = gql`
  query Types {
    types {
      name
    }
  }
`;
