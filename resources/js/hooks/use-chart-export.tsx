import html2canvas from 'html2canvas-pro';

export default function useChartExport() {
    const exportAsImage = async (elementId: string, fileName: string = 'chart') => {
        const element = document.getElementById(elementId);
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: false,
            });

            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error al exportar imagen:', error);
        }
    };

    const exportDashboardCompleteImage = async (containerId: string, fileName: string = 'dashboard-completo') => {
        const element = document.getElementById(containerId);
        if (!element) return;

        try {
            const originalOverflow = element.style.overflow;
            const originalHeight = element.style.height;
            const originalMaxHeight = element.style.maxHeight;
            
            element.style.overflow = 'visible';
            element.style.height = 'auto';
            element.style.maxHeight = 'none';

            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: false,
                scrollY: -window.scrollY,
                scrollX: -window.scrollX,
            });

            element.style.overflow = originalOverflow;
            element.style.height = originalHeight;
            element.style.maxHeight = originalMaxHeight;

            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error al exportar dashboard como imagen:', error);
        }
    };

    return { 
        exportAsImage,
        exportDashboardCompleteImage
    };
}