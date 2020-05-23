import { Context } from '@honzachalupa/helpers';
import PlacesActions from 'Actions/places';
import { IContext } from 'Interfaces/Context';
import { IPlace, IPlaceRemote } from 'Interfaces/Place';
import Layout from 'Layouts/WithSpacing';
import PlacesList from 'Pages/Home/components/PlacesList';
import React, { useContext, useEffect, useState } from 'react';
import './style';

export default () => {
    const { setLoadingState } = useContext(Context) as IContext;
    const [places, setPlaces] = useState<IPlaceRemote[]>([]);

    useEffect(() => {
        PlacesActions.get(setPlaces, setLoadingState, [
            ['isPublished', '==', false],
            ['countryCode', '==', 'CZ']
        ]);
    }, []);

    console.log(places);

    return (
        <Layout title="Místa k editaci">
            <div data-component="Page_PlacesToEdit">
                <PlacesList places={places as IPlace[]} />
            </div>
        </Layout>
    );
};
