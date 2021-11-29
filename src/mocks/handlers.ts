import { rest } from "msw";

const handlers = [
  rest.post(
    `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/auth/register`,
    (req, res, ctx) =>
      res(
        ctx.json({
          name: "Solmaz",
          email: "solmaz@test.com",
          password: "Test!123",
        })
      )
  ),
  rest.post(
    `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/auth/login`,
    (req, res, ctx) =>
      res(
        ctx.json({
          email: "solmaz@test.com",
          name: "Solmaz",
          token: "1234346AFDE2¤¤D)/SFD",
        })
      )
  ),
  rest.get(
    `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/users`,
    (req, res, ctx) =>
      res(
        ctx.json([
          {
            email: "solmaz@test.com",
            userId: "1204730nsldn",
          },
        ])
      )
  ),
  rest.get(
    `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/calendar`,
    (req, res, ctx) =>
      res(
        ctx.json([
          {
            attendees: [
              {
                userId: "lskdhf97",
                email: "solmaz@test.com",
              },
            ],
            date: "2021-11-12T00:00:00.000Z",
            description: "Just for testing!",
            name: "Example meeting",
            endTime: {
              hours: 13,
              minutes: 30,
            },
            startTime: {
              hours: 17,
              minutes: 30,
            },
            _id: "lsknfdhklh0979",
          },
        ])
      )
  ),
  rest.get(
    `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/teams`,
    (req, res, ctx) =>
      res(
        ctx.json([
          {
            name: "Agile team",
            shortName: "AT",
            description: "We are agile",
            members: [{ userId: "lsfk8asknf", email: "solmaz@test.com" }],
            _id: "team1",
          },
          {
            name: "Management Team",
            shortName: "MT",
            description: "Discussion team for the SP area",
            members: [{ userId: "lsfk8asknf", email: "solmaz@test.com" }],
            _id: "team2",
          },
        ])
      )
  ),
  rest.post(
    `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/teams`,
    (req, res, ctx) =>
      res(
        ctx.json({
          name: "Test Team",
          shortName: "TestTeam",
          description: "Just testing!",
          members: [{ userId: "lsfk8asknf", email: "solmaz@test.com" }],
          _id: "team3",
        })
      )
  ),
  rest.patch(
    `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/teams/team1`,
    (req, res, ctx) =>
      res(
        ctx.json({
          name: "Agile team",
          shortName: "AT",
          description: "We are agile",
          members: [{ userId: "lsfk8asknf", email: "solmaz@test.com" }],
          _id: "team1",
        })
      )
  ),

  rest.get(
    `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/users`,
    (req, res, ctx) =>
      res(
        ctx.json([
          {
            email: "solmaz@test.com",
            userId: "1204730nsldn",
          },
        ])
      )
  ),
  rest.get(
    `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/meetings`,
    (req, res, ctx) =>
      res(
        ctx.json([
          {
            attendees: [
              {
                userId: "lskdhf97",
                email: "solmaz@test.com",
              },
            ],
            date: "2021-11-12T00:00:00.000Z",
            description: "Just for testing!",
            name: "Example meeting",
            endTime: {
              hours: 17,
              minutes: 30,
            },
            startTime: {
              hours: 13,
              minutes: 30,
            },
            _id: "lsknfdhklh0979",
          },
        ])
      )
  ),

  rest.patch(
    `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/meetings/lsknfdhklh0979`,
    (req, res, ctx) => res(ctx.json({}))
  ),
];

export default handlers;
