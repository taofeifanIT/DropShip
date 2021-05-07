import { useModel } from 'umi';
const usePopInfo = () => {
    const { initialState } = useModel('@@initialState');
    const getMarkey = (marketId: number,popName: string): any => {
        const data: any = initialState?.allPop[popName] || []
        let tempData = data.find((item) => item.id === marketId);
        return tempData
    }
    return getMarkey
}

export default usePopInfo