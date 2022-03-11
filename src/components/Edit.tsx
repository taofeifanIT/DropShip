
import { useEffect, useRef, useState } from 'react';
import {
    EditOutlined,
    EnterOutlined,
} from '@ant-design/icons';
import {
    message,
    Input,
} from 'antd';

export default (props: {
    id: number;
    pramsKey: string;
    api: any;
    children: any;
    record: any,
    refresh?: (localUpdate?: boolean) => void
}) => {
    const { pramsKey, id, api, record, children,refresh } = props;
    const [editStatus, setEditStates] = useState(false);
    const [editAsin, setEditAsin] = useState(record[pramsKey]);
    const inputEl = useRef(null);
    const updateApi = (title: string) => {
        if (title.trim() === record[pramsKey]) {
            setEditStates(false);
            return;
        }
        api({
            id,
            [pramsKey]: title,
        }).then((res: any) => {
            if (res.code) {
                message.success('operation successful!');
                record[pramsKey] = title
                refresh && refresh(true)
            } else {
                message.error(res.msg);
                setEditAsin(record[pramsKey]);
            }
        });
    };
    useEffect(() => {
        if (editStatus) {
            (inputEl?.current as any).focus();
        }
    }, [editStatus]);
    return (
        <>
            {editStatus ? (
                <>
                    <Input
                        ref={inputEl}
                        size={'small'}
                        style={{ width: '120px' }}
                        suffix={<EnterOutlined />}
                        value={editAsin}
                        onPressEnter={(e: any) => {
                            setEditAsin(e.target.value);
                            setEditStates(false);
                            updateApi(e.target.value);
                        }}
                        onChange={(e) => {
                            setEditAsin(e.target.value);
                        }}
                        onBlur={() => {
                            setEditStates(false);
                            updateApi(editAsin);
                        }}
                    ></Input>
                </>
            ) : (
                <>
                    {children}
                    <EditOutlined
                        style={{ color: '#1890ff', cursor: 'pointer', marginLeft: '6px' }}
                        onClick={() => {
                            setEditStates(true);
                        }}
                    />
                </>
            )}
        </>
    );
};