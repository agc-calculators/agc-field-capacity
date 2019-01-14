import '../../stencil.core';
export declare class AgcFieldCapacityInputs {
    socket: string;
    data: any;
    ready: boolean;
    section: HTMLElement;
    render(): JSX.Element;
    handleResults(e: CustomEvent): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
}
