export async function queryCurrentUser() {
  return window.api.request({
    url: '/api/login/data',
    data: {
      userid: '00000001',
    },
  });
}

export async function queryPost(params: { count: number }) {
  return window.api.request({
    url: '/api/post/data',
  });
}
