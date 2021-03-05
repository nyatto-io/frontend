import React, { FC } from 'react';

type Props = {
	className?: string;
};

const Container: FC<Props> = (props) => {
	return <div className={props.className}>{props.children}</div>;
};

export default Container;
