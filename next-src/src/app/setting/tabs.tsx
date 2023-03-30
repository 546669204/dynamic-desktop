import classnames from "classnames";
import React, { useContext, useState } from "react"

interface TabContextType {
  tabs?: string[],
  currentTab?: string
}

const tabContext = React.createContext<TabContextType>({
  tabs: [],
  currentTab: ''
})


const Tabs = ({ children }: { children: React.ReactNode[] }) => {
  const [context, setContext] = useState<TabContextType>({});
  const chil = React.Children.toArray(children);
  React.useEffect(() => {
    const _ = {
      tabs: chil.map(v => {
        if (typeof v === "object" && "type" in v && v.type === Tabs.TabItem) {
          return v.props.name
        }
      }),
      currentTab: ''
    };
    _.currentTab = _.tabs[0];
    setContext(_)
  }, [children])

  return (
    <tabContext.Provider value={context}>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex flex-col sm:flex-row">
          {context?.tabs?.map((v, i) => {
            return (
              <button type="button" className={classnames("text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none", context.currentTab === v ? "text-blue-500 border-b-2 font-medium border-blue-500" : "")} onClick={() => {
                setContext({ ...context, currentTab: v })
              }}>
                {v}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="mt-3">
        {chil}
      </div>
    </tabContext.Provider >
  )
}

Tabs.TabItem = ({ name, children }: { name: string, children: React.ReactNode }) => {
  const context = useContext(tabContext);
  if (context.currentTab !== name) {
    return <div></div>
  }
  return (
    <div >
      {children}
    </div>
  )
}

export default Tabs;