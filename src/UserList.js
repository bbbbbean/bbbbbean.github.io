//import UserLine from "./UserLine"
import React from 'react';
import { ResponsiveLine } from '@nivo/line';

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

export const UserList = (props) => {

  console.log("chartData : " + props.chartData);
  console.log("chartId : " + props.chartId);

  return (
    <>
      <div className='chart'  style={{ width: "80vw", height: "50vh" }}>
        <ResponsiveLine
        data={[
                    {
                        id: props.chartId,
                        data: props.chartData
                    },
                ]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: '0',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=">-.2f"
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '날짜',
            legendOffset: 36,
            legendPosition: 'middle',
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendOffset: -40,
            legendPosition: 'middle',
            truncateTickAt: 0
        }}
        colors={{ scheme: 'dark2' }}
        lineWidth={4}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'seriesColor', modifiers: [] }}
        pointLabelYOffset={-12}
        enableArea={true}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        motionConfig="default"
        role="application"
    />
      </div>
      <div>
        <List {...props} actions={<ListActions />} filters={postFilters} pagination={<Pagination rowsPerPageOptions={[10, 25, 50, 100]} />} >
          <Datagrid>
            <TextField source="id" />
            <TextField source="userId" />
            <TextField source="name" />
            <TextField source="nickName" />
            <TextField source="gender" />
            <TextField source="manner" />
            <TextField source="phone" />
            <TextField source="points" />
            <TextField source="private" />
            <TextField source="createAt" />
            <TextField source="role" />
            <EditButton />
            <ShowButton />
          </Datagrid>
        </List>
      </div>
    </>
  );
};

export default UserList;
