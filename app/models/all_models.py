import pandas as pd
from sklearn.linear_model import LinearRegression, Lasso
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import LabelEncoder

class Dataset(object):
    def __init__(self, x, y):
        le = LabelEncoder()
        self.x = x
        self.y = le.fit_transform(y) # numpy ndarray
    def __str__(self):
        return (pd.concat([x,y], axis=1))

    def linear_regression(self):
        linreg = LinearRegression()
        try:
            linreg.fit(self.x, self.y)
            return [linreg, linreg.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

    def lasso_regression(self):
        lasso = Lasso()
        try:
            lasso.fit(self.x, self.y)
            return [lasso, lasso.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

    def gradient_boosting_regressor(self):
        gbr = GradientBoostingRegressor()
        try:
            gbr.fit(self.x, self.y)
            return [gbr, gbr.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

    def neural_network_regressor(self):
        nn = MLPRegressor()
        try:
            nn.fit(self.x, self.y)
            return [nn, nn.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")