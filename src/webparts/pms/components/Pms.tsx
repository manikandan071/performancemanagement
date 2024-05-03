import * as React from "react";
// import styles from "./Pms.module.scss";
import type { IPmsProps } from "./IPmsProps";
// import { escape } from "@microsoft/sp-lodash-subset";
import { sp } from "@pnp/sp";
import { graph } from "@pnp/graph";
import MainComponent from "./MainComponent";
import "./style.css";

export default class Pms extends React.Component<IPmsProps, {}> {
  constructor(prop: IPmsProps, state: {}) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context as any,
    });
    graph.setup({
      spfxContext: this.props.context as any,
    });
  }
  public render(): React.ReactElement<IPmsProps> {
    // const {
    //   description,
    //   isDarkTheme,
    //   environmentMessage,
    //   hasTeamsContext,
    //   userDisplayName,
    // } = this.props;

    return (
      <section style={{ margin: "0px 0px 0px 10px" }}>
        <MainComponent context={this.props.context} />
      </section>
    );
  }
}
