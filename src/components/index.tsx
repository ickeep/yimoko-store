import { ArrayBase, ArrayRender } from './array-base';
import { AddPage } from './page/add';
import { DetailPage, FetchDetailPage, ValuesPage } from './page/detail';
import { EditPage } from './page/edit';
import { ListPage } from './page/list';
import { StorePage } from './page/store';
import { StorePageContent } from './page/store-content';
import { RedirectListData } from './redirect-list-data';
import { RedirectValues } from './redirect-values';
import { SchemaBox } from './schema-box';
import { SchemaPage } from './schema-page';
import { SchemaTemplate } from './schema-template';
import { StoreBindRouter } from './store-bind-router';
import { StoreDict } from './store-dict';
import { Trigger } from './trigger';

export const components = {
  ArrayBase,
  ArrayRender,
  RedirectListData,
  RedirectValues,
  SchemaBox,
  SchemaPage,
  SchemaTemplate,
  StoreBindRouter,
  StoreDict,
  Trigger,

  // page
  AddPage,
  DetailPage,
  FetchDetailPage,
  ValuesPage,
  EditPage,
  ListPage,
  StorePageContent,
  StorePage,
};
