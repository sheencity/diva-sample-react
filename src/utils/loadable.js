import React from 'react';
import Loadable from 'react-loadable';

export const loadable = (loader) => {
    return Loadable({
        loader,
        loading() {
            return <div></div>
        },
    });
}