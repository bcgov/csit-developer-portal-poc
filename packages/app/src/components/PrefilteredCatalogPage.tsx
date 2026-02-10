import { useEffect } from 'react';
import {
  CatalogFilterLayout,
  EntityKindPicker,
  EntityOwnerPicker,
  EntityTagPicker,
  EntityLifecyclePicker,
  UserListPicker,
  EntityListProvider,
  useEntityList,
  EntityTagFilter,
} from '@backstage/plugin-catalog-react';

import { CatalogTable } from '@backstage/plugin-catalog';
import { Content, Header, Page } from '@backstage/core-components';

type Props = {
  title: string;
  initialTags?: string[];     // e.g. ['sdx'] or ['authoritative']
  initialKind?: string;       // optional: e.g. 'component', 'api', 'resource'
};

const FilterApplier = ({ tags }: { tags: string[] }) => {
  const { updateFilters } = useEntityList();

  useEffect(() => {
    if (tags.length > 0) {
      updateFilters({
        tags: new EntityTagFilter(tags),
      });
    }
  }, [updateFilters, tags]);

  return null;
};

export const PrefilteredCatalogPage = (props: Props) => {
  const { title, initialTags = [], initialKind } = props;

  return (
    <Page themeId="home">
      <Header title={title} />

      <Content>
        <EntityListProvider pagination>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              {initialKind && <EntityKindPicker initialFilter={initialKind} hidden />}
              <UserListPicker initialFilter="all" />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />          {/* pre-selected by FilterApplier */}
            </CatalogFilterLayout.Filters>

            <CatalogFilterLayout.Content>
              <CatalogTable />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>

          {/* This applies the tag filter on mount */}
          <FilterApplier tags={initialTags} />
        </EntityListProvider>
      </Content>
    </Page>
  );
};