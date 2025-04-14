import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CartLineInput } from '../models/cart/cartLineInput';
import { Observable } from 'rxjs';
import { CartLineUpdate } from '../models/cart/cartLineUpdate';

const GET_SHOP = gql`
  query {
    shop {
      name
    }
  }
`;

const PRODUCTS = gql`
  query getProducts($first: Int!) @inContext(language: EL) {
    products(first: $first) {
      nodes {
        handle
        description
        title
      }
    }
  }
`;

const PRODUCT = gql`
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      description
      title
      availableForSale
      options {
        name
        values
      }
      variants(first: 10) {
        nodes {
          id
          availableForSale
          priceV2 {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }

      images(first: 10) {
        nodes {
          src
        }
      }

      metafields(
        identifiers: [
          { namespace: "custom", key: "how_to_use_title" }
          { namespace: "custom", key: "how_to_use_description" }
          { namespace: "custom", key: "how_to_use_image" }
          { namespace: "custom", key: "details_title" }
          { namespace: "custom", key: "details_description" }
          { namespace: "custom", key: "details_image" }
        ]
      ) {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url(transform: { maxWidth: 2048 })
            }
          }
          
        }
      }
    }
  }
`;

const CREATE_CART = gql`
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
          }
        }
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    title
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD = gql`
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
          }
        }
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    title
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE = gql`
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
          }
        }
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    title
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE = gql`
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
          }
        }
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    title
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_GET = gql`
  query cartGet($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      cost {
        totalAmount {
          amount
        }
      }
      totalQuantity
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                product {
                  title
                }
              }
            }
            cost {
              totalAmount {
                amount
              }
            }
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ShopifyService {
  private apollo = inject(Apollo);

  getShopName() {
    return this.apollo.use('shopify').query({
      query: GET_SHOP,
    });
  }

  getProducts(first: number = 10) {
    return this.apollo.use('shopify').query<any>({
      query: PRODUCTS,
      variables: { first },
    });
  }

  getProduct(handle: string) {
    return this.apollo.use('shopify').query({
      query: PRODUCT,
      variables: { handle },
    });
  }

  createCart(input: { lines: CartLineInput[] }): Observable<any> {
    return this.apollo.use('shopify').mutate({
      mutation: CREATE_CART,
      variables: { input },
    });
  }

  addToCart(cartId: string, lines: CartLineInput[]): Observable<any> {
    return this.apollo.use('shopify').mutate({
      mutation: CART_LINES_ADD,
      variables: { cartId, lines },
    });
  }

  updateCartLines(cartId: string, lines: CartLineUpdate[]): Observable<any> {
    return this.apollo.use('shopify').mutate({
      mutation: CART_LINES_UPDATE,
      variables: { cartId, lines },
    });
  }

  removeCartLines(cartId: string, lineIds: string[]): Observable<any> {
    return this.apollo.use('shopify').mutate({
      mutation: CART_LINES_REMOVE,
      variables: { cartId, lineIds },
    });
  }

  getCart(cartId: string): Observable<any> {
    return this.apollo.use('shopify').query({
      query: CART_GET,
      variables: { cartId },
    });
  }
}
