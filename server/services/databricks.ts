import { DBSQLClient } from "@databricks/sql";
import "dotenv/config";

// Read Databricks connection information from server/.env
const host: string = process.env.DATABRICKS_SERVER_HOSTNAME || "";

const path: string = process.env.DATABRICKS_HTTP_PATH || "";

// Stop immediately if the .env values are missing
if (host === "" || path === "") {
  throw new Error("Missing DATABRICKS_SERVER_HOSTNAME or DATABRICKS_HTTP_PATH");
}

/**
 * Runs a SQL query against Databricks.
 */
export async function runQuery(sql: string, parameters: any[] = []) {
  const client = new DBSQLClient();

  const connectedClient = await client.connect({
    authType: "databricks-oauth",
    host: host,
    path: path,
  });

  const session = await connectedClient.openSession();

  try {
    const operation = await session.executeStatement(sql, {
      runAsync: true,
      maxRows: 1000,
      ordinalParameters: parameters,
    });

    const rows = await operation.fetchAll();

    await operation.close();

    return rows;
  } finally {
    await session.close();
    await connectedClient.close();
  }
}

/**
 * Gets all routes between two campus locations.
 */
export async function findRoutes(origin: string, destination: string) {
  return runQuery(
    `
    SELECT
      route_id,
      origin,
      destination,
      walking_time,
      distance_miles,
      stairs,
      elevators,
      seating,
      slope,
      indoor_percentage,
      restroom_nearby,
      water_nearby
    FROM workspace.hokieassist.routes
    WHERE origin = ?
      AND destination = ?
    ORDER BY walking_time ASC
    `,
    [origin, destination],
  );
}

/**
 * Gets current campus conditions for a location.
 */
export async function getCurrentConditions(location: string) {
  return runQuery(
    `
    SELECT
      *
    FROM workspace.hokieassist.conditions
    WHERE location = ?
    `,
    [location],
  );
}
