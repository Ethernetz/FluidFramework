/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IFluidHandle } from "./handles";

export const IFluidLoadable: keyof IProvideFluidLoadable = "IFluidLoadable";

export interface IProvideFluidLoadable {
    readonly IFluidLoadable: IFluidLoadable;
}
/**
 * A shared FluidObject has a URL from which it can be referenced
 */
export interface IFluidLoadable extends IProvideFluidLoadable {
    // Absolute URL to the Fluid within the document
    readonly url: string;

    // Handle to the loadable FluidObject
    handle: IFluidHandle;
}

export const IFluidRunnable: keyof IProvideFluidRunnable = "IFluidRunnable";

export interface IProvideFluidRunnable {
    readonly IFluidRunnable: IFluidRunnable;
}
export interface IFluidRunnable {
    run(...args: any[]): Promise<void>;
    stop(reason?: string): void;
}

export const IFluidConfiguration: keyof IProvideFluidConfiguration = "IFluidConfiguration";

export interface IProvideFluidConfiguration {
    readonly IFluidConfiguration: IFluidConfiguration;
}

export interface IFluidConfiguration extends IProvideFluidConfiguration {
    canReconnect: boolean;
    scopes: string[];
}
