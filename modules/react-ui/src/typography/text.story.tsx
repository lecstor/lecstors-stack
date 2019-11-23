import * as React from "react";
import styled from "styled-components";

import Layout from "../layout";

import { ScreenTypography } from "../theme/theme-types";

import { P, Div, Body, Caption, Heading, SubHeading } from "./text";
import Shelf from "../layout/shelf";

const Border = styled.div`
  border: 1px solid red;
`;

const PaddedCell = styled.div`
  border: solid 1px #b3b1b1;
  -webkit-box-shadow: inset 0 0 0 20px rgba(199, 222, 184, 0.3);
  box-shadow: inset 0 0 0 20px rgba(199, 222, 184, 0.3);
  display: inline-block;
  margin: 0;
  padding: 20px;
  font-size: 32px;
  max-width: 250px;
`;

const Table = styled.table`
  width: 100%;
  td {
    padding: 0.5rem;
  }
`;

export default {
  title: "Typography"
  // component: Text
};

export const Text = () => (
  <>
    <Layout pad="1">
      <Heading>Fonts</Heading>
      <Layout pad="1">
        <Table>
          <thead>
            <tr>
              <th>Screen width &lt; 480</th>
              <th>Screen width &lt; 768</th>
              <th>Screen width &ge; 768</th>
            </tr>
          </thead>
          <tbody>
            {["1", "2", "3", "4", "5"].map(level => {
              const font = `heading${level}` as keyof ScreenTypography;
              return (
                <tr key={level}>
                  <td>
                    <Div screenSize="small" font={font}>
                      heading{level}
                    </Div>
                  </td>
                  <td>
                    <Div screenSize="medium" font={font}>
                      heading{level}
                    </Div>
                  </td>
                  <td>
                    <Div screenSize="large" font={font}>
                      heading{level}
                    </Div>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td>
                <Div screenSize="small" font="body">
                  body
                </Div>
              </td>
              <td>
                <Div screenSize="medium" font="body">
                  body
                </Div>
              </td>
              <td>
                <Div screenSize="large" font="body">
                  body
                </Div>
              </td>
            </tr>
            <tr>
              <td>
                <Div screenSize="small" font="caption">
                  caption
                </Div>
              </td>
              <td>
                <Div screenSize="medium" font="caption">
                  caption
                </Div>
              </td>
              <td>
                <Div screenSize="large" font="caption">
                  caption
                </Div>
              </td>
            </tr>
          </tbody>
        </Table>
      </Layout>
    </Layout>{" "}
    <Layout pad="1">
      <Heading>Components</Heading>
      <Layout pad="1">
        <Table>
          <thead>
            <tr>
              <th>Screen width &lt; 480</th>
              <th>Screen width &lt; 768</th>
              <th>Screen width &ge; 768</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Heading screenSize="small">Heading</Heading>
              </td>
              <td>
                <Heading screenSize="medium">Heading</Heading>
              </td>
              <td>
                <Heading screenSize="large">Heading</Heading>
              </td>
            </tr>
            <tr>
              <td>
                <SubHeading screenSize="small">SubHeading</SubHeading>
              </td>
              <td>
                <SubHeading screenSize="medium">SubHeading</SubHeading>
              </td>
              <td>
                <SubHeading screenSize="large">SubHeading</SubHeading>
              </td>
            </tr>
            <tr>
              <td>
                <Body screenSize="small">Body</Body>
              </td>
              <td>
                <Body screenSize="medium">Body</Body>
              </td>
              <td>
                <Body screenSize="large">Body</Body>
              </td>
            </tr>
            <tr>
              <td>
                <Caption screenSize="small">Caption</Caption>
              </td>
              <td>
                <Caption screenSize="medium">Caption</Caption>
              </td>
              <td>
                <Caption screenSize="large">Caption</Caption>
              </td>
            </tr>
          </tbody>
        </Table>
      </Layout>
    </Layout>
    <Layout pad="1">
      <Shelf pad="1 0">
        <Div>Plain Text</Div>
        <Div>&lt;Div&gt;</Div>
        <Div>&lt;Div&gt;</Div>
      </Shelf>
      <Shelf pad="1 0">
        <PaddedCell>Lorem ipsum dolor sit.</PaddedCell>
        <PaddedCell>
          <Div font="heading1">Lorem ipsum dolor sit.</Div>
        </PaddedCell>
        <PaddedCell>
          <Div font="heading1">Lorem ipsum dolor sit.</Div>
        </PaddedCell>
      </Shelf>
      <Shelf pad="1 0">
        <PaddedCell>Lorem ipsum</PaddedCell>
        <PaddedCell>
          <Div font="heading1">Lorem ipsum</Div>
        </PaddedCell>
        <PaddedCell>
          <Div font="heading1">Lorem ipsum</Div>
        </PaddedCell>
      </Shelf>
    </Layout>
    <Layout pad="1">
      <Border>
        <Layout pad="1">
          <Div font="heading1">AaBbGgIiJj - Div heading1</Div>
          <Div font="heading1">AaBbGgIiJj - Div heading1</Div>
          <Div font="heading1">AaBbGgIiJj - Div heading1</Div>
          <Div font="heading1">AaBbGgIiJj - Div heading1</Div>
        </Layout>
      </Border>
    </Layout>
    <Layout pad="1">
      <Border>
        <P>
          Lorem ipsum dolor sit amet, <b>consectetur adipiscing elit</b>, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim sed
          faucibus turpis in eu mi bibendum. Nunc scelerisque viverra mauris in
          aliquam sem fringilla ut morbi. Sed egestas egestas fringilla
          phasellus faucibus scelerisque. Scelerisque mauris pellentesque
          pulvinar pellentesque habitant morbi tristique. Dictumst quisque
          sagittis purus sit amet volutpat consequat. Sapien nec sagittis
          aliquam malesuada bibendum arcu. Volutpat sed cras ornare arcu.
        </P>
        <P>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim sed
          faucibus turpis in eu mi bibendum. Nunc scelerisque viverra mauris in
          aliquam sem fringilla ut morbi. Sed egestas egestas fringilla
          phasellus faucibus scelerisque. Scelerisque mauris pellentesque
          pulvinar pellentesque habitant morbi tristique. Dictumst quisque
          sagittis purus sit amet volutpat consequat. Sapien nec sagittis
          aliquam malesuada bibendum arcu. Volutpat sed cras ornare arcu.
        </P>
      </Border>
    </Layout>
  </>
);
