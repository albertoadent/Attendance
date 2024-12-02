export async function csrfFetch(url, options = {}) {
  options.method = options.method || "GET";
  options.headers = options.headers || {};
  options.headers["XSRF-TOKEN"] = localStorage.getItem("XSRF-TOKEN") || "";

  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
  }

  const res = await fetch(url, options);
  if (!res.ok) {
    throw res;
  }

  const token = res.headers.get("XSRF-TOKEN");

  if (token) {
    localStorage.setItem("XSRF-TOKEN", token);
  } else if (token === "") {
    localStorage.removeItem("XSRF-TOKEN");
  }

  return res;
}

export async function post(url, reqBody = {}) {
  const data = await csrfFetch(url, {
    method: "POST",
    body: JSON.stringify(reqBody),
  });
  return data.json();
}
export async function put(url, reqBody = {}) {
  const data = await csrfFetch(url, {
    method: "PUT",
    body: JSON.stringify(reqBody),
  });
  return data.json();
}
export async function get(url) {
  const data = await csrfFetch(url);
  return data.json();
}
export async function del(url) {
  const data = await csrfFetch(url, { method: "DELETE" });
  return data.json();
}
