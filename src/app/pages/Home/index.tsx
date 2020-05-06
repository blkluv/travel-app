import React, { useContext, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import cx from 'classnames';
import { Context } from '@honzachalupa/helpers';
import Layout from 'Layouts/Main';
import Navigation from 'Components/Navigation';
import { IContext } from 'Interfaces/Context';
import { Routes } from 'Enums/Routes';
import { ButtonWithIcon, EColors } from 'Components/Button';
import Map from 'Components/Map';
import './style';
import { IPlaceWithId } from 'Interfaces/Place';

export default withRouter(({ history }: RouteComponentProps) => {
    const { places } = useContext(Context) as IContext;
    const [isMapExpanded, setMapExpanded] = useState<boolean>(false);

    return (
        <Layout>
            <div data-component="Page_Home" className={cx({ 'is-scrolling-disabled': isMapExpanded })}>
                <Navigation />

                <div className={cx('my-location-map', { 'is-expanded': isMapExpanded })}>
                    <Map markers={places} onPlaceClick={(place: IPlaceWithId) => history.push(Routes.PLACE_DETAIL.replace(':id', place.id))} />

                    <ButtonWithIcon className="toggle-button" icon={isMapExpanded ? 'A' : 'V'} color={EColors.YELLOW} onClick={() => setMapExpanded(!isMapExpanded)} />
                </div>

                <div className={cx('places-list', { 'is-faded': isMapExpanded })}>
                    {places.map(place => (
                        <div key={place.id} className="place" onClick={() => history.push(Routes.PLACE_DETAIL.replace(':id', place.id))}>
                            <h3 className="name">{place.name}</h3>

                            <div className="details">
                                <img className="image" src="https://i.picsum.photos/id/10/360/240.jpg" />
                                <p className="description">{place.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <ButtonWithIcon className="add-button" label="Přidat" icon="+" color={EColors.GREEN} onClick={() => history.push(Routes.PLACE_CREATE)} />
            </div>
        </Layout>
    );
});
