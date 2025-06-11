import React, { useState } from 'react';
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { UserList } from './UserList';
import instance from './axios'
import "../src/css/admin.css"
const AdminPage = () => {
  const baseDataProvider = simpleRestProvider('http://localhost:8100');

  const [chartData,setchartData] = useState([]);
  const [chartId,setchartId] = useState([]);

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
      const response = await instance.post(url);
      setchartData(response.data.chartData.data);
      setchartId(response.data.chartData.id);
      return {
        data: response.data.data,
        total: response.data.total,
      };
    }
  };

  return (
    <Admin dataProvider={dataProvider} basename="/admin">
      <Resource name="users" list={<UserList chartData={chartData} chartId={chartId} />} />
      <Resource name="match" list={<UserList chartData={chartData} chartId={chartId} />} />
    </Admin>
  );
};

export default AdminPage;
