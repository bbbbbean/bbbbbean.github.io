import React from 'react';

import {
  CreateButton,
  EditButton,
  ShowButton,
  TextInput,
  List,
  Datagrid,
  TextField,
  ExportButton,
  SelectColumnsButton,
  TopToolbar,
  SearchInput,
  Pagination,
} from 'react-admin';

const ListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const postFilters = [
  <SearchInput source="q" alwaysOn />,
  <TextInput label="Title" source="title" defaultValue="" />,
];

export const BookList = (props) => {

  return (
    <div>
      <List {...props} actions={<ListActions />} filters={postFilters} pagination={<Pagination rowsPerPageOptions={[10, 25, 50, 100]} />} >
        <Datagrid>
          <TextField source="id" />
          <TextField source="bookCode" />
          <TextField source="bookName" />
          <TextField source="publisher" />
          <TextField source="isbn" />
          <EditButton />
          <ShowButton />
        </Datagrid>
      </List>
    </div>
  );
};

export default BookList;
