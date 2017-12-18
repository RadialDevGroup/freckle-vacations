import axios from 'axios';

const headers = {'X-FreckleToken': process.env.REACT_APP_FRECKLE_TOKEN};

export default function entries(people=[41127], year=2017) {
  return axios.get(`/api/entries.json?search[from]=${year}-01-01&search[people]=${people.join(',')}&per_page=1000`, {headers}).then(({data, headers: {link}}) => {
    if (link) {
      console.warn('More entries than one page!!!!!', link)
    }
    return data;
  })
}
