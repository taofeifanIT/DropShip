import React from 'react';
import { Typography } from 'antd';
const { Text } = Typography;
const ParagraphText = (props: { content: string; width: number, style?: React.CSSProperties }) => {
    const [ellipsis] = React.useState(true);
    const { content, width,style } = props;
    return (
      <Text
        style={ellipsis ? { width: width, display: 'inline', ...style } : undefined}
        ellipsis={ellipsis ? { tooltip: content } : false}
      >
        {content}
      </Text>
    );
  };
  

export default ParagraphText