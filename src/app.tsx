import React, { Fragment, useState } from 'react';
import { Button, SafeAreaView, StatusBar, View } from 'react-native';
import { LatLng, MapView } from 'react-native-amap3d';

const App = () => {
  const [mapType, setMapType] = useState(0);
  const [center, setCenter] = useState({ longitude: 114.412254, latitude: 30.491328 });
  const coordinates = [{ longitude: 116.397972, latitude: 39.806901 }];
  const [zoomLevel, setZoomLevel] = useState(15);
  const [myCoordinates, setMyCoordinates] = useState([{ longitude: 0, latitude: 0, title: '', description: '' }]);

  const onLongClick = (data: LatLng) => {
    console.log('onLongClick', data);
    setMyCoordinates([...myCoordinates, { longitude: data.longitude, latitude: data.latitude, title: '', description: '' }]);
  };

  const logStatusChangeCompleteEvent = (data: any) => {
    console.log('logStatusChangeCompleteEvent', data);
    setCenter(data.center);
  };

  const onSetMapType = (value: number) => () => setMapType(value);

  const onAddPoint = (data: any) => () => {
    const current = myCoordinates[data.index];
    myCoordinates[data.index] = {
      ...current,
      title: `鄂州华容钓点${data.index}`,
      description: '免费钓、30公里、高速8块、大小鱼都有',
    };
    setMyCoordinates(myCoordinates);
  };

  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={{ flexDirection: 'row' }}>
          <Button title={'标准'} onPress={onSetMapType(0)} />
          <Button title={'卫星'} onPress={onSetMapType(1)} />
          <Button
            title={'当前位置'}
            onPress={() => {
              setCenter({ longitude: 114.40475632164762, latitude: 30.48624298758906 });
              setZoomLevel(18);
            }}
          />
        </View>
        <MapView
          mapType={mapType}
          onLocation={({ latitude, longitude }) => console.log(`${latitude}, ${longitude}`)}
          style={{ width: '100%', height: '95%' }}
          locationEnabled
          zoomLevel={zoomLevel}
          onLongClick={onLongClick}
          onStatusChangeComplete={logStatusChangeCompleteEvent}
          showsCompass={true}
          showsScale={true}
          showsZoomControls={true}
          showsLocationButton={true}
          showsTraffic={false}
          center={center}>
          <MapView.Circle strokeWidth={2} strokeColor="rgba(0, 0, 255, 0.5)" fillColor="rgba(255, 0, 0, 0.5)" radius={100} coordinate={coordinates[0]} />
          <MapView.Marker
            active
            draggable
            title="鄂州华容钓点"
            description={'免费钓、30公里、高速8块、大小鱼都有。免费钓、30公里、高速8块、大小鱼都有'}
            infoWindowDisabled={true}
            onInfoWindowPress={() => console.log('2222')}
            coordinate={center}
          />
          {myCoordinates.map((item, index) => {
            const color = ['green', 'red', 'purple'][index % 3];
            console.log('item', JSON.stringify(item));
            return (
              <MapView.Marker
                key={index}
                image="flag"
                color={color}
                title={item.title || '点击添加更多信息'}
                description={item.description || undefined}
                coordinate={item}
                onInfoWindowPress={onAddPoint({ ...item, index })}
              />
            );
          })}
        </MapView>
      </SafeAreaView>
    </Fragment>
  );
};

export default App;
