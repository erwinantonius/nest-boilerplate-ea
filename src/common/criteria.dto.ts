export class CriteriaDto {
  filter?: string | any = '{}';
  skip?: number = 0;
  limit?: number = 50;
  sort?: string | null = null; //&sort=created_at  // &sort=-created_at
  populate?: string | null = null; //populate=warehouse,location
  select?: string | null = null; // &select=username first_name
  patch_obj?: any = null;
  populate_string?: string | any = ''; //populate_string=[{path:'warehouse',select:'code'}]
  withCount?: string; //count relation with custom controller
  aggregation?: Array<any>;
}
