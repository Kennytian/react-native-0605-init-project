import { gql } from '@apollo/client';

export const FETCH_PROFILE = gql`
  {
    profile(limit: 10, offset: 0, order_by: { id: asc }, where: { id: { _gte: 0 } }) {
      id
      name
    }
  }
`;

/*
 *  String! 字符串，非空
 *  Int 数字
 *  [Float] 浮点型数组
 * */
// 如果传参数，就要取个 getProfiles 名字（随意）
export const FETCH_PROFILE2 = gql`
  query getProfiles($id: Int!, $limit: Int) {
    profile(where: { id: { _gte: $id } }, limit: $limit) {
      name
      id
    }
  }
`;
