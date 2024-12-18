const logoutController = (req , res)=>{
    try {
        res.cookie("jwttoken", '', {
            expires: 0,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        return res.status(200).json({ data: "user logout" });
    }
    catch (err) {
        return res.status(401).json({ err: "Error" });
    }
}

module.exports = logoutController;