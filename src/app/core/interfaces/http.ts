export interface IProducts {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
  brand: string;
  model: string;
  color: string;
  category: string;
  quantity:number;
  discount: number;
  popular: boolean;
  isAddedToCart: boolean;
  isAddedToWishlist:boolean;
}
