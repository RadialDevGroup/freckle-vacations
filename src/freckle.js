import axios from 'axios';

const headers = {'X-FreckleToken': process.env.REACT_APP_FRECKLE_KEY};
const parseLink = (link) => link.replace(/<https?:\/\/[^/]*/, '').replace(/>;.*/, '')

export function entries({user_id, year}) {
  if (!user_id) return Promise.reject();
  return axios.get(`/api/entries.json?search[from]=${year}-01-01&search[to]=${year}-12-31&search[people]=${user_id}&per_page=1000`, {headers}).then(({data, headers: {link}}) => {
    if (link) {
      console.warn('More entries than one page!!!!', link);
      return axios.get(parseLink(link), {headers}).then(({data:data2, headers: {link}}) => {
        if (link) {
          console.warn('More entries than two pages!!!!!', link);
        }
        return [...data, ...data2];
      });
    }
    return data;
  });
}

export function users() {
  return axios.get(`/api/users.json`, {headers}).then(({data}) => {
    return data;
  });
}

export default {entries, users};
