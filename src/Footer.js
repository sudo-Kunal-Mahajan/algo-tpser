const FooterMain = ({ which_api }) => {
    return (
        <div className="footer-bs mt-auto bg-dark text-white" id="footer">
        
            <div className="text-center p-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                Powered By {which_api}
            </div>
        </div>
    )
}

export default FooterMain;
