import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Context from '../Context/myContext';
import { getLocalStorage } from '../LocalStorage/localStorage';
import { emptyLocalStorage,
  filterLocalStorage } from '../LocalStorage/localStorageCarrinho';

export default function Cards({ name, price, urlImage, id }) {
  const { setTotalPrice } = useContext(Context);

  const [qtdState, setQtdState] = useState(0);

  const [firstTime, setFirstTime] = useState(false);

  const getTotalPrice = () => {
    const carrinho = getLocalStorage('carrinho');
    if (carrinho) {
      const total = carrinho.reduce((acc, cur) => +cur.subtotal + acc, 0);
      setTotalPrice(total.toFixed(2));
    }
  };

  const product = {
    id,
    name,
    price,
    urlImage,
    quantity: qtdState,
    subtotal: (+qtdState * +price).toFixed(2),
  };

  const incrementQtd = () => {
    setQtdState(qtdState + 1);
  };

  const decrementQtd = () => {
    if (qtdState <= 0) {
      return setQtdState(0);
    }
    setQtdState(qtdState - 1);
  };

  const handleChangeQtd = ({ target: { value } }) => {
    if (+value <= 0) {
      return setQtdState(0);
    }
    setQtdState(+value);
  };

  useEffect(() => {
    if (firstTime) {
      const localStorage = getLocalStorage('carrinho');
      if (localStorage === null) { return emptyLocalStorage(product); }

      if (localStorage.length > 0) { return filterLocalStorage(product); }
    } else {
      setFirstTime(true);
    }
  }, [qtdState]);

  useEffect(
    () => {
      getTotalPrice();
    },
    [qtdState],
  );

  return (
    <div>
      <div className="cards">
        <img
          src={ urlImage }
          alt={ name }
          width="50px"
          data-testid={ `customer_products__img-card-bg-image-${id}` }
        />
        <h2 data-testid={ `customer_products__element-card-title-${id}` }>
          {name}
        </h2>
        <h3
          data-testid={ `customer_products__element-card-price-${id}` }
        >
          {price.replace('.', ',')}
        </h3>
        <button
          type="button"
          data-testid={ `customer_products__button-card-add-item-${id}` }
          onClick={ incrementQtd }
        >
          +
        </button>
        <input
          value={ qtdState }
          type="number"
          name="quantity"
          data-testid={ `customer_products__input-card-quantity-${id}` }
          onChange={ handleChangeQtd }
        />
        <button
          type="button"
          data-testid={ `customer_products__button-card-rm-item-${id}` }
          onClick={ decrementQtd }
        >
          -
        </button>
      </div>
    </div>
  );
}

Cards.propTypes = {
  name: PropTypes.string,
  price: PropTypes.number,
  urlImage: PropTypes.string,
  id: PropTypes.number,
}.isRequired;
