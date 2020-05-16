import { Context } from '@honzachalupa/helpers';
import { EColors } from 'Components/Button';
import Map from 'Components/Map';
import Navigation from 'Components/Navigation';
import { ECountryCodes } from 'Enums/CountryCodes';
import { Difficulties, DifficultyCodes } from 'Enums/Difficulties';
import { Database } from 'Helpers';
import AcceptIcon from 'Icons/accept.svg';
import CrossIcon from 'Icons/cross.svg';
import { IContext } from 'Interfaces/Context';
import { ICoordinates, IPlacePartial } from 'Interfaces/Place';
import Layout from 'Layouts/WithSpacing';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './style';

enum ValidationState {
    VALID = 'VALID',
    INVALID = 'INVALID'
}

export default withRouter(({ history }: RouteComponentProps) => {
    // const inputElementRef = useRef(null);
    const { currentUser } = useContext(Context) as IContext;
    const [validationState, setValidationState] = useState<ValidationState>(ValidationState.INVALID);
    const [selectedCoordinates, setSelectedCoordinates] = useState<ICoordinates>({ latitude: 0, longitude: 0});
    const [websitesString, setWebsitesString] = useState<string>('');
    const [instagramPostsString, setInstagramPostsString] = useState<string>('');
    const [images /* , setImages */] = useState<string[]>([]);

    const [place, setPlace] = useState<IPlacePartial>({
        name: '',
        description: '',
        coordinates: selectedCoordinates,
        countryCode: ECountryCodes.CZ,
        rating: {
            value: 0,
            count: 0
        },
        images,
        instagramPosts: [],
        accessibility: {
            walkingDistance: 0,
            difficultyCode: DifficultyCodes.NONE
        },
        tags: [],
        websites: [],
        tripIds: [],
        addedBy: {
            id: currentUser.uid,
            timestamp: ''
        },
        updatesHistory: [],
        usersVisited: [],
        isPublished: false
    });

    const setPlaceProperty = (propertyKey: string, value: any) => {
        if (propertyKey.includes('.')) {
            setPlace((place: IPlacePartial) => ({
                ...place,
                [propertyKey.split('.')[0]]: {
                    ...place[propertyKey.split('.')[0]],
                    [propertyKey.split('.')[1]]: value
                }
            }));
        } else {
            setPlace((place: IPlacePartial) => ({
                ...place,
                [propertyKey]: value
            }));
        }
    };

    /* const handleFileUpload = (files: FileList) => {
        Array.from(files).forEach(async file => {
            if (file.size < 1048487) {
                try {
                    const fileContent = await readUploadedFile(file) as string;

                    setImages(prevImages => [...prevImages, fileContent]);
                } catch (error) {
                    alert(error.message)
                }
            } else {
                alert('File is too big.');
            }
        });
    }; */

    const handleSubmit = () => {
        const placeClone = { ...place };

        placeClone.coordinates = selectedCoordinates;
        placeClone.websites = websitesString.split(',').map(url => url.trim()).filter(x => x.length > 0);
        placeClone.instagramPosts = instagramPostsString.split(',').map(url => url.trim()).filter(x => x.length > 0);
        placeClone.images = images;

        Database.places.add(placeClone);
    };

    useEffect(() => {
        const isValid =
            place.name.length > 2 &&
            // place.description.length > 10 &&
            // place.accessibility.walkingDistance > 0 &&
            // place.accessibility.difficultyCode !== DifficultyCodes.NONE &&
            selectedCoordinates.latitude > 0 &&
            selectedCoordinates.longitude > 0;

        setValidationState(isValid ? ValidationState.VALID : ValidationState.INVALID);
    }, [place, selectedCoordinates]);

    return (
        <Layout title="Přidat místo">
            <div data-component="Page_PlaceCreate">
                <form className="form">
                    <label htmlFor="name">Název</label>
                    <input name="name" type="text" onChange={(e: any) => setPlaceProperty('name', e.target.value)} defaultValue={place.name} />

                    <label htmlFor="description">Popis</label>
                    <textarea name="description" onChange={(e: any) => setPlaceProperty('description', e.target.value)} defaultValue={place.description} />

                    <label htmlFor="walkingDistance">Pěší vzdálenost v km (např. od parkoviště)</label>
                    <input name="walkingDistance" type="number" step={0.1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlaceProperty('accessibility.walkingDistance', Number(e.target.value))} defaultValue={place.accessibility.walkingDistance} />

                    <label htmlFor="difficultyCode">Obtížnost</label>
                    <select name="difficultyCode" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlaceProperty('accessibility.difficultyCode', e.target.value)} defaultValue={place.accessibility.difficultyCode}>
                        {Difficulties.map(difficulty => (
                            <option key={difficulty.id} value={difficulty.id}>{difficulty.label}</option>
                        ))}
                    </select>

                    <label htmlFor="websites">Odkazy na web</label>
                    <textarea name="websites" onChange={(e: any) => setWebsitesString(e.target.value)} defaultValue={place.websites.join(',')} />

                    <label htmlFor="instagramPosts">Odkazy na IG</label>
                    <textarea name="instagramPosts" onChange={(e: any) => setInstagramPostsString(e.target.value)} defaultValue={place.instagramPosts} />

                    {/* <input style={{ display: 'none' }} type="file" accept="image/png, image/jpeg" multiple onChange={(e: any) => handleFileUpload(e.target.files)} ref={inputElementRef} /> */}

                    {/*
                     // @ts-ignore */}
                    {/* <Button label={`Nahrát fotky ${images.length > 0 ? ` (nahráno: ${images.length})` : ''}`} color={EColors.ORANGE} onClick={() => inputElementRef.current.click()} /> */}

                    <label htmlFor="isPublished">Publikováno</label>
                    <select name="isPublished" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlaceProperty('isPublished', e.target.value === 'true')} defaultValue={place.isPublished.toString()}>
                        <option value="true">Ano</option>
                        <option value="false">Ne</option>
                    </select>

                    <Map onMapClick={setSelectedCoordinates} isPoiVisible />
                </form>

                <Navigation
                    items={[{
                        label: 'Zpět',
                        icon: CrossIcon,
                        color: EColors.ORANGE,
                        onClick: () => history.goBack()
                    }, {
                        label: 'Přidat',
                        icon: AcceptIcon,
                        color: EColors.GREEN,
                        isDisabled: validationState === ValidationState.INVALID,
                        onClick: handleSubmit
                    }]}
                />
            </div>
        </Layout>
    );
});
