import React from 'react';
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { BookList } from './BookList';

const AdminPage = () => {
  const baseDataProvider = simpleRestProvider('http://localhost:8100');

  const dataProvider = {
    ...baseDataProvider,
    getList: async (resource, params) => {
      const { pagination, sort, filter } = params;
      let url = `http://localhost:8100/admin/${resource}`
            + `?page=${pagination.page}`
            + `&perPage=${pagination.perPage}`
            + `&order=${sort.order}`
            + `&field=${sort.field}`;
      if (typeof(filter.q) === "string") {
        url = url + `&filter=${filter.q}`;
      }
      console.log(url)
      const response = await fetch(url);
      const data = await response.json();
      return {
        data: data.data,
        total: data.total,
      };
    }
  };

  return (
    <Admin dataProvider={dataProvider} basename="/admin">
      <Resource name="books" list={BookList} />
      <Resource name="users" list={BookList} />
      <Resource name="alert" list={BookList} />
      <Resource name="chat" list={BookList} />
      <Resource name="report" list={BookList} />=
    </Admin>
  );
};

export default AdminPage;
