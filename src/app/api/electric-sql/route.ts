import { env } from "~/env";

export async function GET(request: Request) {
  const url = new URL(`${request.url}`);
  const electricSqlBackendUrl = new URL(
    `${env.ELECTRIC_SQL_BACKEND_URL}/v1/shape`,
  );

  url.searchParams.forEach((value, key) => {
    electricSqlBackendUrl.searchParams.set(key, value);
  });

  // if (process.env.ELECTRIC_SOURCE_ID) {
  //   electricSqlBackendUrl.searchParams.set(
  //     `source_id`,
  //     process.env.ELECTRIC_SOURCE_ID,
  //   );
  // }

  const headers = new Headers();
  // if (process.env.ELECTRIC_SOURCE_SECRET) {
  //   electricSqlBackendUrl.searchParams.set(
  //     `secret`,
  //     process.env.ELECTRIC_SOURCE_SECRET,
  //   );
  // }

  const newRequest = new Request(electricSqlBackendUrl.toString(), {
    method: `GET`,
    headers,
  });

  // When proxying long-polling requests, content-encoding & content-length are added
  // erroneously (saying the body is gzipped when it's not) so we'll just remove
  // them to avoid content decoding errors in the browser.
  //
  // Similar-ish problem to https://github.com/wintercg/fetch/issues/23
  let resp = await fetch(newRequest);
  if (resp.headers.get(`content-encoding`)) {
    const headers = new Headers(resp.headers);
    headers.delete(`content-encoding`);
    headers.delete(`content-length`);
    resp = new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers,
    });
  }
  return resp;
}
