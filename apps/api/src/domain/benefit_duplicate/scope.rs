use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum BenefitScope {
    #[serde(rename = "INDIVIDUAL")]
    Individual,
    #[serde(rename = "HOUSEHOLD")]
    Household,
    #[serde(rename = "PROPERTY")]
    Property,
    #[serde(rename = "COMPOSITE")]
    Composite,
}

impl BenefitScope {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Individual => "INDIVIDUAL",
            Self::Household => "HOUSEHOLD",
            Self::Property => "PROPERTY",
            Self::Composite => "COMPOSITE",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s.to_uppercase().as_str() {
            "INDIVIDUAL" => Self::Individual,
            "HOUSEHOLD" => Self::Household,
            "PROPERTY" => Self::Property,
            _ => Self::Composite,
        }
    }
}
